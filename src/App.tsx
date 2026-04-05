import { Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";

import Dashboard from "./pages/dashboard";
import { BookOpen, GraduationCap, Home, Building2, Users } from "lucide-react";
import { Layout } from "./components/refine-ui/layout/layout";
import { dataProvider } from "./providers/data";

// Subjects
import Subjectlist from "./pages/subjects/list";
import SubjectCreate from "./pages/subjects/create";
import SubjectEdit from "./pages/subjects/edit";
import SubjectShow from "./pages/subjects/show";

// Classes
import Classlist from "./pages/classes/list";
import ClassCreate from "./pages/classes/create";
import ClassEdit from "./pages/classes/edit";
import ClassesShow from "./pages/classes/show";

// Departments
import DepartmentList from "./pages/departments/list";
import DepartmentCreate from "./pages/departments/create";
import DepartmentEdit from "./pages/departments/edit";
import DepartmentShow from "./pages/departments/show";

// Users
import UserList from "./pages/users/list";
import UserShow from "./pages/users/show";
import UserEdit from "./pages/users/edit";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "dSJG92-iS3Amf-5NZlqU",
                reactQuery: {
                  clientConfig: {
                    defaultOptions: {
                      queries: {
                        staleTime: 1000 * 60 * 5,
                        refetchOnWindowFocus: false,
                      },
                    },
                  },
                },
              }}
              resources={[
                {
                  name: 'dashboard',
                  list: '/',
                  meta: { label: 'Home', icon: <Home /> }
                },
                {
                  name: 'departments',
                  list: '/departments',
                  create: '/departments/create',
                  edit: '/departments/edit/:id',
                  show: '/departments/show/:id',
                  meta: { label: 'Departments', icon: <Building2 /> }
                },
                {
                  name: 'subjects',
                  list: '/subjects',
                  create: '/subjects/create',
                  edit: '/subjects/edit/:id',
                  show: '/subjects/show/:id',
                  meta: { label: 'Subjects', icon: <BookOpen /> }
                },
                {
                  name: 'classes',
                  list: '/classes',
                  create: '/classes/create',
                  edit: '/classes/edit/:id',
                  show: '/classes/show/:id',
                  meta: { label: 'Classes', icon: <GraduationCap /> }
                },
                {
                  name: 'users',
                  list: '/users',
                  show: '/users/show/:id',
                  edit: '/users/edit/:id',
                  meta: { label: 'Users', icon: <Users /> }
                },
              ]}
            >
              <Routes>
                <Route element={
                  <Layout>
                    <Outlet />
                  </Layout>
                }>
                  <Route path="/" element={<Dashboard />} />

                  <Route path="departments">
                    <Route index element={<DepartmentList />} />
                    <Route path="create" element={<DepartmentCreate />} />
                    <Route path="edit/:id" element={<DepartmentEdit />} />
                    <Route path="show/:id" element={<DepartmentShow />} />
                  </Route>

                  <Route path="subjects">
                    <Route index element={<Subjectlist />} />
                    <Route path="create" element={<SubjectCreate />} />
                    <Route path="edit/:id" element={<SubjectEdit />} />
                    <Route path="show/:id" element={<SubjectShow />} />
                  </Route>

                  <Route path="classes">
                    <Route index element={<Classlist />} />
                    <Route path="create" element={<ClassCreate />} />
                    <Route path="edit/:id" element={<ClassEdit />} />
                    <Route path="show/:id" element={<ClassesShow />} />
                  </Route>

                  <Route path="users">
                    <Route index element={<UserList />} />
                    <Route path="show/:id" element={<UserShow />} />
                    <Route path="edit/:id" element={<UserEdit />} />
                  </Route>
                </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
