import { DataTable } from "@/components/refine-ui/data-table/data-table"
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb"
import { ListView } from "@/components/refine-ui/views/list-view"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "@/types"
import { useTable } from "@refinedev/react-table"
import { ColumnDef } from "@tanstack/react-table"
import { Search } from "lucide-react"
import { useMemo, useState } from "react"
import { ShowButton } from "@/components/refine-ui/buttons/show"
import { EditButton } from "@/components/refine-ui/buttons/edit"
import { DeleteButton } from "@/components/refine-ui/buttons/delete"

const UserList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');

    const roleFilter = selectedRole === 'all' ? [] : [
        { field: 'role', operator: 'eq' as const, value: selectedRole }
    ];

    const searchFilter = searchQuery ? [
        { field: 'name', operator: 'contains' as const, value: searchQuery }
    ] : [];

    const userTable = useTable<User>({
        columns: useMemo<ColumnDef<User>[]>(() => [
            {
                id: 'avatar',
                size: 60,
                header: () => <p className="column-title ml-2"></p>,
                cell: ({ row }) => (
                    <Avatar className="h-9 w-9 ml-2">
                        <AvatarImage src={row.original.image} />
                        <AvatarFallback>{row.original.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                )
            },
            {
                id: 'name',
                accessorKey: 'name',
                size: 180,
                header: () => <p className="column-title">Name</p>,
                cell: ({ getValue }) => <span className="text-foreground font-medium">{getValue() as string}</span>,
            },
            {
                id: 'email',
                accessorKey: 'email',
                size: 220,
                header: () => <p className="column-title">Email</p>,
                cell: ({ getValue }) => <span className="text-muted-foreground">{getValue() as string}</span>,
            },
            {
                id: 'role',
                accessorKey: 'role',
                size: 100,
                header: () => <p className="column-title">Role</p>,
                cell: ({ getValue }) => {
                    const role = getValue() as string;
                    const variant = role === 'admin' ? 'destructive' as const : role === 'teacher' ? 'default' as const : 'secondary' as const;
                    return <Badge variant={variant}>{role}</Badge>;
                }
            },
            {
                id: 'createdAt',
                accessorKey: 'createdAt',
                size: 120,
                header: () => <p className="column-title">Joined</p>,
                cell: ({ getValue }) => {
                    const date = getValue() as string;
                    return <span className="text-muted-foreground text-sm">{date ? new Date(date).toLocaleDateString() : '—'}</span>;
                }
            },
            {
                id: 'actions',
                size: 180,
                header: () => <p className="column-title">Actions</p>,
                cell: ({ row }) => (
                    <div className="flex items-center gap-1">
                        <ShowButton resource="users" recordItemId={row.original.id} variant="outline" size="sm">View</ShowButton>
                        <EditButton resource="users" recordItemId={row.original.id} variant="outline" size="sm" />
                        <DeleteButton resource="users" recordItemId={row.original.id} variant="outline" size="sm" />
                    </div>
                )
            }
        ], []),
        refineCoreProps: {
            resource: 'users',
            pagination: {
                pageSize: 10,
                mode: 'server'
            },
            sorters: {
                initial: [{ field: 'createdAt', order: 'desc' }]
            },
            filters: {
                permanent: [...roleFilter, ...searchFilter]
            },
        }
    });

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Users</h1>

            <div className="into-row">
                <p>Manage students, teachers, and administrators.</p>
            </div>

            <div className="action-row">
                <div className="search-field">
                    <Search className="search-icon" />
                    <Input
                        type="text"
                        placeholder="Search by name or email..."
                        className="pl-10 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <Select
                        value={selectedRole}
                        onValueChange={setSelectedRole}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter By Role..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="teacher">Teacher</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <DataTable table={userTable} />
        </ListView>
    )
}

export default UserList
