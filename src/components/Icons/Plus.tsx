const Plus: React.FC<{ color?: string }> = ({ color = "white" }) => {
	return (
		<svg
			width="13"
			height="12"
			viewBox="0 0 13 12"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M6.1908 0.75V11.2515V0.75Z" fill={color} />
			<path
				d="M6.1908 0.75V11.2515"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path d="M11.3815 6.00146H1H11.3815Z" fill={color} />
			<path
				d="M11.3815 6.00146H1"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default Plus;
