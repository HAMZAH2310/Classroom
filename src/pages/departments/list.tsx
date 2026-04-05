import { CreateButton } from "@/components/refine-ui/buttons/create"
import { ShowButton } from "@/components/refine-ui/buttons/show"
import { DataTable } from "@/components/refine-ui/data-table/data-table"
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb"
import { ListView } from "@/components/refine-ui/views/list-view"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Department } from "@/types"
import { useTable } from "@refinedev/react-table"
import { ColumnDef } from "@tanstack/react-table"
import { Search, Building2 } from "lucide-react"
import { useMemo, useState } from "react"
import { DeleteButton } from "@/components/refine-ui/buttons/delete"
import { EditButton } from "@/components/refine-ui/buttons/edit"

const DepartmentList = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const searchFilter = searchQuery ? [
        { field: 'name', operator: 'contains' as const, value: searchQuery }
    ] : [];

    const departmentTable = useTable<Department>({
        columns: useMemo<ColumnDef<Department>[]>(() => [
            {
                id: 'code',
                accessorKey: 'code',
                size: 120,
                header: () => <p className="column-title ml-2">Code</p>,
                cell: ({ getValue }) => <Badge className="ml-2">{getValue() as string}</Badge>
            },
            {
                id: 'name',
                accessorKey: 'name',
                size: 200,
                header: () => <p className="column-title">Name</p>,
                cell: ({ getValue }) => (
                    <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary/60" />
                        <span className="text-foreground font-medium">{getValue() as string}</span>
                    </div>
                ),
            },
            {
                id: 'description',
                accessorKey: 'description',
                header: () => <p className="column-title">Description</p>,
                cell: ({ getValue }) => <span className="text-muted-foreground truncate line-clamp-2">{(getValue() as string) || '—'}</span>
            },
            {
                id: 'subjectCount',
                accessorKey: 'subjectCount',
                size: 120,
                header: () => <p className="column-title">Subjects</p>,
                cell: ({ getValue }) => (
                    <Badge variant="secondary">{getValue() as number} subjects</Badge>
                )
            },
            {
                id: 'actions',
                size: 180,
                header: () => <p className="column-title">Actions</p>,
                cell: ({ row }) => (
                    <div className="flex items-center gap-1">
                        <ShowButton resource="departments" recordItemId={row.original.id} variant="outline" size="sm">View</ShowButton>
                        <EditButton resource="departments" recordItemId={row.original.id} variant="outline" size="sm" />
                        <DeleteButton resource="departments" recordItemId={row.original.id} variant="outline" size="sm" />
                    </div>
                )
            }
        ], []),
        refineCoreProps: {
            resource: 'departments',
            pagination: {
                pageSize: 10,
                mode: 'server'
            },
            sorters: {
                initial: [
                    { field: 'createdAt', order: 'desc' }
                ]
            },
            filters: {
                permanent: [...searchFilter]
            },
        }
    });

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Departments</h1>

            <div className="into-row">
                <p>Manage academic departments and their associated subjects.</p>
            </div>

            <div className="action-row">
                <div className="search-field">
                    <Search className="search-icon" />
                    <Input
                        type="text"
                        placeholder="Search by name or code..."
                        className="pl-10 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <CreateButton resource="departments" />
                </div>
            </div>

            <DataTable table={departmentTable} />
        </ListView>
    )
}

export default DepartmentList
