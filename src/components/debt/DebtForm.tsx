'use client';
/* react */
import { useEffect } from 'react';
/* redux */
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import type { AppDispatch } from '@/redux/store';
import { createDebt, updateDebt } from '@/redux/slices/debtSlice';

/* 3rd party */
import { useForm, SubmitHandler } from 'react-hook-form';
import { useHookFormMask } from 'use-mask-input';
import { MdCheck } from 'react-icons/md';
/* component */
import { Loading } from '@/components';
/* lib */
import paymentPlan from '@/lib/paymentPlan';
import stringToFloat from '@/lib/stringToFloat';
import numberToMoneyDecimal from '@/lib/numberToMoneyDecimal';
/* types */
import { Debt } from '@/types';

interface DebtFormProps {
	onSuccess: () => void;
	debtId?: string;
	debtData?: {
		debtName: string;
		lenderName: string;
		debtAmount: number;
		installment: number;
		interestRate: number;
		paymentStart: string;
		description: string;
	};
}

const DebtForm: React.FC<DebtFormProps> = ({ onSuccess, debtId, debtData }) => {
	const dispatch = useDispatch<AppDispatch>();
	const { formStatus, formError } = useSelector(
		(state: RootState) => state.debt
	);

	const {
		register,
		getValues,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm<Debt>({
		defaultValues: { ...debtData },
	});
	const registerWithMask = useHookFormMask(register);

	const calculate = () => {
		const values = getValues();
		const { installment, debtAmount, interestRate } = values;

		if (installment && debtAmount && interestRate) {
			const totalInterestRate = (installment * interestRate) / 100;
			const totalAmount = debtAmount + debtAmount * totalInterestRate;
			const installmentAmount = totalAmount / installment;

			setValue('amount', totalAmount);
			setValue(
				'installmentAmount',
				numberToMoneyDecimal(installmentAmount)
			);
		}
	};

	const onSubmit: SubmitHandler<Debt> = (data) => {
		if (formStatus !== 'pending') {
			let pDate = null;
			if (
				data.paymentStart.length === 10 &&
				data.paymentStart.includes('-')
			) {
				const [d, m, y] = data.paymentStart.split('-').map(String);
				pDate = `${y}-${m}-${d}`;
				data.paymentStart = pDate;
			} else {
				const [d, m, y] = data.paymentStart
					.split(' ')[0]
					.split('.')
					.map(Number);
				pDate = `${y}-${m}-${d}`;
			}
			const plan = paymentPlan.create(
				data.amount,
				data.installment,
				pDate
			);
			data.paymentPlan = plan;
			if (data.installmentAmount) {
				delete data.installmentAmount;
			}

			if (debtId) {
				dispatch(
					updateDebt({
						debtId: debtId,
						data: data,
					})
				);
			} else {
				dispatch(createDebt(data));
			}
		}
	};

	useEffect(() => {
		if (formStatus === 'success') {
			onSuccess();
		}
		if (debtId && formStatus === 'init') {
			calculate();
		}
	}, [formStatus]);

	if (formStatus === 'success') {
		return (
			<div>
				<div
					className={
						'w-full bg-emerald-500 text-white p-4 flex items-center'
					}
				>
					<MdCheck />
					Ödeme planı başarıyla kaydedildi
				</div>
			</div>
		);
	}
	return (
		<div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className={'flex flex-col gap-2'}
			>
				<div className={'flex gap-2'}>
					<div className={'formRow'}>
						<div className={`${errors.debtName ? 'error' : ''}`}>
							<label>Borç Adı</label>
							<input
								className={''}
								type={'text'}
								{...register('debtName', {
									required: 'Borç adı giriniz',
								})}
								placeholder={'Kira, kredi, fatura vb.'}
							/>
						</div>
						{errors?.debtName?.message && (
							<div className={'errorMessage'}>
								{errors.debtName.message}
							</div>
						)}
					</div>
					<div className={'formRow'}>
						<div className={`${errors.lenderName ? 'error' : ''}`}>
							<label>Alacaklı</label>
							<input
								className={''}
								type={'text'}
								{...register('lenderName', {
									required: 'Alacaklı adı giriniz',
								})}
								placeholder={'alacaklı'}
							/>
						</div>
						{errors?.lenderName?.message && (
							<div className={'errorMessage'}>
								{errors.lenderName.message}
							</div>
						)}
					</div>
				</div>
				<div className={'formRow'}>
					<div className={`${errors.debtAmount ? 'error' : ''}`}>
						<label>Miktar</label>
						<input
							type={'text'}
							{...registerWithMask('debtAmount', 'currency', {
								required: 'Borç miktarı giriniz',
								placeholder: '0,00',
								prefix: '',
								suffix: ' ₺',
								radixPoint: ',',
								setValueAs: (v) => stringToFloat(v),
								validate: {
									positive: (v) =>
										v > 0.1 || 'En az 0.1 ₺ olmalıdır',
								},
								onChange: (e) => {
									calculate();
								},
							})}
						/>
					</div>

					{errors?.debtAmount?.message && (
						<div className={'errorMessage'}>
							{errors.debtAmount.message}
						</div>
					)}
				</div>

				<div className={'flex gap-2'}>
					<div className={'formRow'}>
						<div className={`${errors.installment ? 'error' : ''}`}>
							<label>Taksit Sayısı</label>
							<input
								type={'text'}
								{...registerWithMask('installment', 'numeric', {
									setValueAs: (v) => stringToFloat(v),
									required: 'Taksit sayısı giriniz',
									validate: (v) =>
										v > 0 || 'En az 1 taksit olmalıdır',
									onChange: (e) => {
										calculate();
									},
								})}
							/>
						</div>
						{errors?.installment?.message && (
							<div className={'errorMessage'}>
								{errors.installment.message}
							</div>
						)}
					</div>

					<div className={'formRow'}>
						<div
							className={`${errors.interestRate ? 'error' : ''}`}
						>
							<label>Faiz Oranı</label>
							<input
								type={'text'}
								{...registerWithMask(
									'interestRate',
									'decimal',
									{
										placeholder: '0,00%',
										suffix: '%',
										required: 'Faiz oranı giriniz',
										setValueAs: (v) => stringToFloat(v),
										onChange: (e) => {
											calculate();
										},
									}
								)}
							/>
						</div>
						{errors?.interestRate?.message && (
							<div className={'errorMessage'}>
								{errors.interestRate.message}
							</div>
						)}
					</div>
				</div>

				<div className={'flex gap-2'}>
					<div className={'formRow'}>
						<div
							className={`${errors.paymentStart ? 'error' : ''}`}
						>
							<label>Başlangıç Tarihi</label>
							<input
								type={'text'}
								{...registerWithMask(
									'paymentStart',
									'datetime',
									{
										inputFormat: 'dd-mm-yyyy',
										placeholder: 'GG-AA-YYYY',
										required: 'Bir tarih giriniz',
									}
								)}
							/>
						</div>
						{errors?.paymentStart?.message && (
							<div className={'errorMessage'}>
								{errors.paymentStart.message}
							</div>
						)}
					</div>

					<div className={'formRow'}>
						<label>Açıklama</label>
						<input type={'text'} {...register('description')} />
					</div>
				</div>

				<div className={'flex gap-2'}>
					<div className={'formRow'}>
						<label>Taksit Tutarı</label>
						<input
							type={'text'}
							readOnly={true}
							{...registerWithMask(
								'installmentAmount',
								'currency',
								{
									placeholder: '0,00',
									prefix: '',
									suffix: ' ₺',
									radixPoint: ',',
								}
							)}
						/>
					</div>
					<div className={'formRow'}>
						<label>Toplam Tutar</label>
						<input
							type={'text'}
							readOnly={true}
							{...registerWithMask('amount', 'currency', {
								placeholder: '0,00',
								prefix: '',
								suffix: ' ₺',
								radixPoint: ',',
							})}
						/>
					</div>
				</div>

				<div className={'flex mt-4 justify-between items-center'}>
					<div>
						{formError && (
							<div
								className={
									'inline bg-red-700 text-white px-4 py-2 text-xs'
								}
							>
								{formError}
							</div>
						)}
					</div>
					<button
						disabled={formStatus === 'pending'}
						className={'btn-primary'}
					>
						{formStatus === 'pending' && <Loading />}
						{debtId ? 'Kaydet' : 'Oluştur'}
					</button>
				</div>
			</form>
		</div>
	);
};
export default DebtForm;
