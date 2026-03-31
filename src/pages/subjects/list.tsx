import { CreateButton } from "@/components/refine-ui/buttons/create"
import { DataTable } from "@/components/refine-ui/data-table/data-table"
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb"
import { ListView } from "@/components/refine-ui/views/list-view"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DEPARTMENTS_OPTIONS } from "@/constants"
import { Subject } from "@/types"
import { useTable } from "@refinedev/react-table"
import { ColumnDef } from "@tanstack/react-table"
import { Search } from "lucide-react"
import { useMemo, useState } from "react"

const Subjectlist = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('all');

    const departmenFilter = selectedDepartment === 'all' ? [] : [
        { field: 'department', operator: 'eq' as const, value: selectedDepartment }
    ]

    const searchFilter = searchQuery ? [
        { field: 'name', operator: 'contains' as const, value: searchQuery }
    ] : [];

    const subjectTable = useTable<Subject>({
        columns: useMemo<ColumnDef<Subject>[]>(() => [
            {
                id: 'code',
                accessorKey: 'code',
                size: 100,
                header: () => <p className="column-title ml-2">Code</p>,
                cell: ({ getValue }) => <Badge>{getValue() as string}</Badge>
            },
            {
                id: 'name',
                accessorKey: 'name',
                size: 200,
                header: () => <p className="column-title">Name</p>,
                cell: ({ getValue }) => <span className="text-foreground">{getValue() as string}</span>,
                filterFn: 'includesString'
            },
            {
                id: 'department',
                accessorKey: 'department',
                size: 150,
                header: () => <p className="column-title">Department</p>,
                cell: ({ getValue }) => <Badge variant="secondary">{getValue() as string}</Badge>
            },
            {
                id: 'description',
                accessorKey: 'description',
                header: () => <p className="column-title">Description</p>,
                cell: ({ getValue }) => <span className="truncate line-clamp-2">{getValue() as string}</span>
            }
        ], []),
        refineCoreProps: {
            resource: 'subjects',
            pagination: {
                pageSize: 10,
                mode: 'server'
            },
            sorters: {
                initial: [
                    { field: 'id', order: 'desc' }
                ]
            },
            filters: {
                permanent: [...departmenFilter, ...searchFilter]
            },
        }
    })

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Subjects</h1>

            <div className="into-row">
                <p>Quick access to essential metrics and management tools.</p>
            </div>

            <div className="action-row">
                <div className="search-field">
                    <Search className="search-icon" />
                    <Input
                        type="text"
                        placeholder="Search by name..."
                        className="p-10 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <Select
                        value={selectedDepartment}
                        onValueChange={setSelectedDepartment}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Filter By Department..." />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem
                                value="all"
                            >
                                All Departments
                            </SelectItem>
                            {DEPARTMENTS_OPTIONS.map(departmen => (
                                <SelectItem
                                    key={departmen.value}
                                    value={departmen.value}
                                >
                                    {departmen.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <CreateButton />
                </div>
            </div>

            <DataTable table={subjectTable} />
        </ListView>
    )
}

export default Subjectlist