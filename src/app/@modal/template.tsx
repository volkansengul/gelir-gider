'use client';
/* next */
import { useRouter } from 'next/navigation';
/* 3rd party */
import { motion } from 'framer-motion';
import { MdClose } from 'react-icons/md';

const Template = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();

	return (
		<>
			<div className={'modalOpac'}></div>
			<motion.div
				className={
					'modal flex items-center justify-center absolute w-full bottom-0'
				}
				initial={{ y: 40, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ ease: 'easeInOut', duration: 0.5 }}
			>
				<button
					className={'modalClose'}
					onClick={() => {
						router.back();
					}}
				>
					<MdClose />
				</button>
				{children}
			</motion.div>
		</>
	);
};
export default Template;
