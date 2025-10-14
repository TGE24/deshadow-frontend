import Skeleton from "react-loading-skeleton";

const TableLoader: React.FC<{ columns?: number }> = ({ columns = 4 }) => {
	return (
		<tbody>
			{Array.from({ length: 10 }).map((_, index) => (
				<tr key={index} className="border-b-[1px] border-[#E3E3E3]">
					{Array.from({ length: columns }).map((_, colIndex) => (
						<td
							key={colIndex}
							className="first-of-type:pl-[18px] py-[20px] text-[14px] whitespace-nowrap px-[12px]"
						>
							<Skeleton height={20} width={100} />
						</td>
					))}
				</tr>
			))}
		</tbody>
	);
};

export default TableLoader;
