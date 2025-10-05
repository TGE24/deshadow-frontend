const Credit: React.FC<{ color?: string }> = ({ color = "#FFEBD0" }) => {
	return (
		<svg
			width="13"
			height="15"
			viewBox="0 0 13 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M10 4.875C10 2.80393 8.32105 1.125 6.25 1.125C4.17893 1.125 2.5 2.80393 2.5 4.875C2.5 6.94605 4.17893 8.625 6.25 8.625C8.32105 8.625 10 6.94605 10 4.875Z"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M11.5 13.875C11.5 10.9755 9.1495 8.625 6.25 8.625C3.35051 8.625 1 10.9755 1 13.875"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default Credit;
