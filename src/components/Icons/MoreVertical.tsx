interface MoreVerticalProps {
	color?: string;
	className?: string;
}

const MoreVertical = ({ color = "#000000", className }: MoreVerticalProps) => {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<circle cx="12" cy="12" r="3" fill={color} />
			<circle cx="4" cy="12" r="3" fill={color} />
			<circle cx="20" cy="12" r="3" fill={color} />
		</svg>
	);
};

export default MoreVertical;
