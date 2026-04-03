import { CreateButton } from "@/components/refine-ui/buttons/create"
import { DataTable } from "@/components/refine-ui/data-table/data-table"
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb"
import { ListView } from "@/components/refine-ui/views/list-view"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSelect } from "@refinedev/core"
import { useTable } from "@refinedev/react-table"
import { ColumnDef } from "@tanstack/react-table"
import { Search } from "lucide-react"
import { useMemo, useState } from "react"

const ClassList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedTeacher, setSelectedTeacher] = useState('all');

    const subjectFilter = selectedSubject === 'all' ? [] : [
        { field: 'subject', operator: 'eq' as const, value: selectedSubject }
    ];

    const teacherFilter = selectedTeacher === 'all' ? [] : [
        { field: 'teacher', operator: 'eq' as const, value: selectedTeacher }
    ];

    const searchFilter = searchQuery ? [
        { field: 'name', operator: 'contains' as const, value: searchQuery }
    ] : [];

    const { options: subjectOptions } = useSelect({
        resource: "subjects",
        optionLabel: "name",
        optionValue: "name",
    });

    const { options: teacherOptions } = useSelect({
        resource: "users",
        filters: [
            { field: "role", operator: "eq", value: "teacher" }
        ],
        optionLabel: "name",
        optionValue: "name",
    });

    const classTable = useTable<any>({
        columns: useMemo<ColumnDef<any>[]>(() => [
            {
                id: 'bannerUrl',
                accessorKey: 'bannerUrl',
                size: 80,
                header: () => <p className="column-title ml-2">Banner</p>,
                cell: ({ getValue }) => {
                    const url = getValue() as string;
                    return url ? (
                        <img src={url} alt="Banner" className="w-10 h-10 rounded-full object-cover ml-2" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-200 ml-2"></div>
                    );
                }
            },
            {
                id: 'name',
                accessorKey: 'name',
                size: 200,
                header: () => <p className="column-title">Class Name</p>,
                cell: ({ getValue }) => <span className="text-foreground font-medium">{getValue() as string}</span>,
            },
            {
                id: 'status',
                accessorKey: 'status',
                size: 100,
                header: () => <p className="column-title">Status</p>,
                cell: ({ getValue }) => {
                    const status = getValue() as string;
                    return (
                        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
                            {status}
                        </Badge>
                    );
                }
            },
            {
                id: 'subject',
                accessorKey: 'subject.name',
                size: 150,
                header: () => <p className="column-title">Subject</p>,
                cell: ({ getValue }) => <span className="text-muted-foreground">{getValue() as string}</span>
            },
            {
                id: 'teacher',
                accessorKey: 'teacher.name',
                size: 150,
                header: () => <p className="column-title">Teacher</p>,
                cell: ({ getValue }) => <span>{getValue() as string}</span>
            },
            {
                id: 'capacity',
                accessorKey: 'capacity',
                size: 100,
                header: () => <p className="column-title">Capacity</p>,
                cell: ({ getValue }) => <span>{getValue() as number}</span>
            }
        ], []),
        refineCoreProps: {
            resource: 'classes',
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
                permanent: [...subjectFilter, ...teacherFilter, ...searchFilter]
            },
        }
    });

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Classes</h1>

            <div className="into-row">
                <p>Manage all your classroom sessions and student enrollments.</p>
            </div>

            <div className="action-row">
                <div className="search-field">
                    <Search className="search-icon" />
                    <Input
                        type="text"
                        placeholder="Search by class name..."
                        className="p-10 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <Select
                        value={selectedSubject}
                        onValueChange={setSelectedSubject}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter By Subject..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Subjects</SelectItem>
                            {subjectOptions?.map(subject => (
                                <SelectItem key={subject.value} value={subject.value.toString()}>
                                    {subject.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={selectedTeacher}
                        onValueChange={setSelectedTeacher}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter By Teacher..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Teachers</SelectItem>
                            {teacherOptions?.map(teacher => (
                                <SelectItem key={teacher.value} value={teacher.value.toString()}>
                                    {teacher.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <CreateButton resource="classes" />
                </div>
            </div>

            <DataTable table={classTable} />
        </ListView>
    )
}

export default ClassList