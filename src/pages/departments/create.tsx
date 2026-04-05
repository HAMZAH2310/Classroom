import { CreateView, CreateViewHeader } from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useForm as useRefineForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { departmentSchema } from "@/lib/schema";
import { z } from 'zod'
import { Resolver } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SaveIcon, Building2 } from "lucide-react";

type DepartmentFormValues = z.infer<typeof departmentSchema>;

const DepartmentCreate = () => {
    const form = useRefineForm<any, any, DepartmentFormValues>({
        resolver: zodResolver(departmentSchema) as Resolver<DepartmentFormValues>,
        refineCoreProps: {
            resource: 'departments',
            action: 'create',
            redirect: 'list',
        },
        defaultValues: {
            code: '',
            name: '',
            description: '',
        },
    });

    const {
        refineCore: { onFinish, formLoading },
        saveButtonProps,
        control,
        handleSubmit,
    } = form;

    return (
        <CreateView className="container max-w-2xl py-6 space-y-8">
            <CreateViewHeader title="Create New Department" />

            <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm ring-1 ring-white/10">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold tracking-tight">Department Details</CardTitle>
                            <CardDescription>Enter the information for the new department.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <Separator className="bg-white/5" />
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onFinish)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Department Code</FormLabel>
                                            <FormControl>
                                                <Input className="bg-background/50 border-white/10" placeholder="e.g. CS, MATH" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Department Name</FormLabel>
                                            <FormControl>
                                                <Input className="bg-background/50 border-white/10" placeholder="e.g. Computer Science" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Brief description of the department..."
                                                className="min-h-[100px] bg-background/50 border-white/10 resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex items-center justify-end gap-4 pt-4">
                                <Button
                                    type="submit"
                                    disabled={formLoading}
                                    className="px-8 bg-gradient-to-r from-primary to-primary/80 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/20"
                                    {...saveButtonProps}
                                >
                                    {formLoading ? "Creating..." : (
                                        <span className="flex items-center gap-2">
                                            <SaveIcon className="w-4 h-4" /> Create Department
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </CreateView>
    );
};

export default DepartmentCreate
