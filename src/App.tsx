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
import { BookOpen, GraduationCap, Home } from "lucide-react";
import { Layout } from "./components/refine-ui/layout/layout";
import Subjectlist from "./pages/subjects/list";
import Subjectcreate from "./pages/subjects/create";
import { dataProvider } from "./providers/data";
import Classlist from "./pages/classes/list";
import ClassCreate from "./pages/classes/create";
import ClassesShow from "./pages/classes/show";

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
                        staleTime: 1000 * 60 * 5, // Cache API GET requests for 5 minutes
                        refetchOnWindowFocus: false, // Prevent refetching when tab is focused
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
                  name: 'subjects',
                  list: '/subjects',
                  create: '/subjects/create',
                  meta: { label: 'Subjects', icon: <BookOpen /> }
                },
                {
                  name: 'classes',
                  list: '/classes',
                  create: '/classes/create',
                  show: '/classes/show:id',
                  meta: { label: 'Classes', icon: <GraduationCap /> }
                }
              ]}
            >
              <Routes>
                <Route element={
                  <Layout>
                    <Outlet />
                  </Layout>
                }>
                  <Route path="/" element={<Dashboard />} />

                  <Route path="subjects">
                    <Route index element={<Subjectlist />} />
                    <Route path="create" element={<Subjectcreate />} />
                  </Route>

                  <Route path="classes">
                    <Route index element={<Classlist />} />
                    <Route path="create" element={<ClassCreate />} />
                    <Route path="show/:id" element={<ClassesShow />} />
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
