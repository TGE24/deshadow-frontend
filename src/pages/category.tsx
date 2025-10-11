import { useEffect, useState, useMemo } from "react";
import Button from "../components/Button";
import Plus from "../components/Icons/Plus";
import AddCategory from "../modules/Modals/AddCategory";
import {
	Category as CategoryType,
	useCategoriesLazyQuery,
	useDeleteCategoryMutation,
} from "../generated/graphql";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { cn } from "../utils/cn";
import CategoryLoading from "../components/CategoryLoading";
import DeleteModal from "../modules/Modals/DeleteModal";

const Category = () => {
	const [selectedCategory, setSelectedCategory] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const [page, setPage] = useState(1);
	const [open, setOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [getcategories, { data: categories, loading, refetch }] =
		useCategoriesLazyQuery({ fetchPolicy: "network-only" });
	const [deleteCategory, { loading: deleteLoading }] =
		useDeleteCategoryMutation();
	const [data, setData] = useState<CategoryType[]>([]);

	const columns = useMemo<ColumnDef<CategoryType>[]>(
		() => [
			{
				accessorKey: "name",
				cell: (info) => info.getValue(),
				header: () => <h4>Category Name</h4>,
			},
			{
				accessorKey: "description",
				cell: (info) => info.getValue(),
				header: () => <h4>Description</h4>,
			},
			{
				accessorKey: "status",
				cell: (info) => (
					<div
						className={cn(
							{ "bg-[#ecfdf3] text-[#027a48]": info.getValue() === "active" },
							{ "bg-[#fef3f2] text-[#b42318]": info.getValue() !== "active" },
							"w-[70px] h-[24px] flex items-center justify-center rounded-[10px] text-[12px] font-medium capitalize"
						)}
					>
						{String(info.getValue())}
					</div>
				),
				header: () => <h4>Status</h4>,
			},
			{
				header: "Actions",
				cell: (info) => (
					<div className="flex gap-[20px]">
						<button className="font-medium cursor-pointer">Edit</button>
						<button
							className="font-medium cursor-pointer"
							onClick={() => {
								setDeleteOpen(true);
								setSelectedCategory({
									id: info.row.original.uuid,
									name: info.row.original.name,
								});
							}}
						>
							Delete
						</button>
					</div>
				),
			},
		],
		[]
	);

	useEffect(() => {
		getcategories({ variables: { pagination: { first: 10 } } });
	}, [getcategories]);

	useEffect(() => {
		if (categories?.categories?.edges) {
			setData(
				categories.categories.edges
					.map((edge) => edge.node)
					.filter((node) => node.__typename === "Category") as CategoryType[]
			);
		}
	}, [categories]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const nextPage = () => {
		if (categories?.categories?.pageInfo?.hasNextPage) {
			getcategories({
				variables: {
					pagination: {
						first: 10,
						after: categories?.categories?.pageInfo?.endCursor,
					},
				},
			});
			setPage(page + 1);
		}
	};

	const prevPage = () => {
		if (categories?.categories?.pageInfo?.hasPreviousPage) {
			getcategories({
				variables: {
					pagination: {
						last: 10,
						before: categories?.categories?.pageInfo?.startCursor,
					},
				},
			});
			setPage(page - 1);
		}
	};

	return (
		<>
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-[10px]">
				<div>
					<h2 className="text-[16px] md:text-[20px] font-bold">
						Manage Category
					</h2>
				</div>
				<Button
					size="small"
					icon={<Plus color="#060606" />}
					onClick={() => setOpen(true)}
					className="bg-[#F2F2FE] text-[#060606] border-[#F2F2FE]"
				>
					Add Category
				</Button>
			</div>
			<div className="w-full mt-[48px] overflow-x-auto">
				<table className="w-full min-w-[800px]">
					<thead className="bg-[#D4E7E6] h-[41px]">
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id} className="text-[14px] font-semibold">
								{headerGroup.headers.map((header) => (
									<th
										key={header.id}
										className="text-left first-of-type:pl-[18px] whitespace-nowrap px-[12px]"
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</th>
								))}
							</tr>
						))}
					</thead>
					{loading ? (
						<CategoryLoading />
					) : (
						<tbody>
							{table.getRowModel().rows.map((row) => (
								<tr key={row.id} className="border-b-[1px] border-[#E3E3E3]">
									{row.getVisibleCells().map((cell) => (
										<td
											key={cell.id}
											className="first-of-type:pl-[18px] py-[20px] text-[14px] whitespace-nowrap px-[12px]"
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</td>
									))}
								</tr>
							))}
						</tbody>
					)}
				</table>
				<div className="flex items-center justify-between mt-[30px]">
					<p>
						Showing 1 to {data.length} of {categories?.categories?.totalCount}{" "}
						entries
					</p>
					<div className="flex items-center gap-[15px]">
						<Button
							variant="tetriary"
							disabled={
								!categories?.categories?.pageInfo?.hasPreviousPage || loading
							}
							size="small"
							onClick={prevPage}
						>
							Previous
						</Button>
						<div className="px-[18px] py-[11px] bg-[#278783] rounded-[6px] text-white">
							{page}
						</div>
						<Button
							variant="tetriary"
							size="small"
							disabled={
								!categories?.categories?.pageInfo?.hasNextPage || loading
							}
							onClick={nextPage}
						>
							Next
						</Button>
					</div>
				</div>
			</div>
			<AddCategory open={open} setOpen={setOpen} refetch={refetch} />
			<DeleteModal
				open={deleteOpen}
				setOpen={setDeleteOpen}
				refetch={refetch}
				title="Remove Category"
				copy={`Are you sure you want to remove ${selectedCategory?.name}?`}
				action={() => {
					deleteCategory({
						variables: { uuid: selectedCategory?.id },
						onCompleted: () => {
							setDeleteOpen(false);
							refetch();
						},
					});
				}}
				loading={deleteLoading}
			/>
		</>
	);
};

export default Category;
