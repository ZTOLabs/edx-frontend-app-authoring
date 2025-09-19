import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize, mergeConfig, getConfig, getPath,
} from '@edx/frontend-platform';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';
import React, { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Route, createRoutesFromElements, createBrowserRouter, RouterProvider,
} from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import AppLayout from 'shared/Components/Common/Layouts/AppLayout';

import { initializeHotjar } from '@edx/frontend-enterprise-hotjar';
import { logError } from '@edx/frontend-platform/logging';
import { MainCardLayout } from 'shared/Components/Common/Layouts/MainCardLayout';
import messages from './i18n';
import { StudentsPage } from './students-page/index';

import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';

import {
  ComponentPicker,
  CreateLibrary,
  LibraryLayout,
  PreviewChangesEmbed,
} from './library-authoring';
import initializeStore from './store';
import CourseAuthoringRoutes from './CourseAuthoringRoutes';
import Head from './head/Head';
import StudioHome from './studio-home/StudioHome';
import { Home } from './home';
import CourseRerun from './course-rerun';
import { TaxonomyLayout, TaxonomyDetailPage, TaxonomyListPage } from './taxonomy';
import { ContentTagsDrawer } from './content-tags-drawer';
import AccessibilityPage from './accessibility-page';
import { ToastProvider } from './generic/toast-context';

import 'react-datepicker/dist/react-datepicker.css';
import './index.scss';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 60_000, // If cache is up to one hour old, no need to re-fetch
    },
  },
});

const App = () => {
  useEffect(() => {
    if (process.env.HOTJAR_APP_ID) {
      try {
        initializeHotjar({
          hotjarId: process.env.HOTJAR_APP_ID,
          hotjarVersion: process.env.HOTJAR_VERSION,
          hotjarDebug: !!process.env.HOTJAR_DEBUG,
        });
      } catch (error) {
        logError(error);
      }
    }
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<AppLayout />}>
        <Route
          path="/home"
          element={(
            <MainCardLayout>
              <Home />
            </MainCardLayout>
          )}
        />
        {/* <Route path="/libraries" element={<StudioHome />} />
        <Route path="/libraries-v1" element={<StudioHome />} /> */}
        <Route
          path="/library/create"
          element={(
            <MainCardLayout>
              <CreateLibrary />
            </MainCardLayout>
          )}
        />
        <Route
          path="/library/:libraryId/*"
          element={(
            <MainCardLayout>
              <LibraryLayout />
            </MainCardLayout>
          )}
        />

        <Route
          path="/courses"
          element={(
            <MainCardLayout>
              <StudioHome />
            </MainCardLayout>
          )}
        />
        <Route
          path="/students"
          element={(
            <MainCardLayout>
              <StudentsPage />
            </MainCardLayout>
          )}
        />

        <Route
          path="/component-picker"
          element={(
            <MainCardLayout>
              <ComponentPicker extraFilter={['NOT block_type = "unit"']} />
            </MainCardLayout>
          )}
        />
        <Route
          path="/component-picker/multiple"
          element={(
            <MainCardLayout>
              <ComponentPicker
                componentPickerMode="multiple"
                extraFilter={['NOT block_type = "unit"']}
              />
            </MainCardLayout>
          )}
        />
        <Route
          path="/legacy/preview-changes/:usageKey"
          element={(
            <MainCardLayout>
              <PreviewChangesEmbed />
            </MainCardLayout>
          )}
        />
        <Route path="/course/:courseId/*" element={<CourseAuthoringRoutes />} />
        <Route
          path="/course_rerun/:courseId"
          element={(
            <MainCardLayout>
              <CourseRerun />
            </MainCardLayout>
          )}
        />
        {getConfig().ENABLE_ACCESSIBILITY_PAGE === 'true' && (
          <Route
            path="/accessibility"
            element={(
              <MainCardLayout>
                <AccessibilityPage />
              </MainCardLayout>
            )}
          />
        )}
        {getConfig().ENABLE_TAGGING_TAXONOMY_PAGES === 'true' && (
          <>
            <Route
              path="/taxonomies"
              element={(
                <MainCardLayout>
                  <TaxonomyLayout />
                </MainCardLayout>
              )}
            >
              <Route index element={<TaxonomyListPage />} />
            </Route>
            <Route
              path="/taxonomy"
              element={(
                <MainCardLayout>
                  <TaxonomyLayout />
                </MainCardLayout>
              )}
            >
              <Route path="/taxonomy/:taxonomyId" element={<TaxonomyDetailPage />} />
            </Route>
            <Route
              path="/tagging/components/widget/:contentId"
              element={(
                <MainCardLayout>
                  <ContentTagsDrawer />
                </MainCardLayout>
              )}
            />
          </>
        )}
      </Route>,
    ),
    {
      basename: getPath(getConfig().PUBLIC_PATH),
    },
  );

  return (
    <AppProvider store={initializeStore()} wrapWithRouter={false}>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <Head />
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ToastProvider>
    </AppProvider>
  );
};

subscribe(APP_READY, () => {
  const root = createRoot(document.getElementById('root'));

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  const root = createRoot(document.getElementById('root'));

  root.render(
    <StrictMode>
      <ErrorPage message={error.message} />
    </StrictMode>,
  );
});

initialize({
  handlers: {
    config: () => {
      mergeConfig({
        SUPPORT_URL: process.env.SUPPORT_URL || null,
        SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || null,
        LEARNING_BASE_URL: process.env.LEARNING_BASE_URL,
        LMS_BASE_URL: process.env.LMS_BASE_URL || null,
        EXAMS_BASE_URL: process.env.EXAMS_BASE_URL || null,
        CALCULATOR_HELP_URL: process.env.CALCULATOR_HELP_URL || null,
        ENABLE_PROGRESS_GRAPH_SETTINGS: process.env.ENABLE_PROGRESS_GRAPH_SETTINGS || 'false',
        ENABLE_TEAM_TYPE_SETTING: process.env.ENABLE_TEAM_TYPE_SETTING === 'true',
        ENABLE_OPEN_MANAGED_TEAM_TYPE: process.env.ENABLE_OPEN_MANAGED_TEAM_TYPE === 'true',
        BBB_LEARN_MORE_URL: process.env.BBB_LEARN_MORE_URL || '',
        STUDIO_BASE_URL: process.env.STUDIO_BASE_URL || null,
        STUDIO_SHORT_NAME: process.env.STUDIO_SHORT_NAME || null,
        TERMS_OF_SERVICE_URL: process.env.TERMS_OF_SERVICE_URL || null,
        PRIVACY_POLICY_URL: process.env.PRIVACY_POLICY_URL || null,
        ENABLE_ACCESSIBILITY_PAGE: process.env.ENABLE_ACCESSIBILITY_PAGE || 'false',
        NOTIFICATION_FEEDBACK_URL: process.env.NOTIFICATION_FEEDBACK_URL || null,
        ENABLE_UNIT_PAGE: process.env.ENABLE_UNIT_PAGE || 'false',
        ENABLE_ASSETS_PAGE: process.env.ENABLE_ASSETS_PAGE || 'false',
        ENABLE_VIDEO_UPLOAD_PAGE_LINK_IN_CONTENT_DROPDOWN: process.env.ENABLE_VIDEO_UPLOAD_PAGE_LINK_IN_CONTENT_DROPDOWN || 'false',
        ENABLE_CERTIFICATE_PAGE: process.env.ENABLE_CERTIFICATE_PAGE || 'false',
        ENABLE_TAGGING_TAXONOMY_PAGES: process.env.ENABLE_TAGGING_TAXONOMY_PAGES || 'false',
        ENABLE_HOME_PAGE_COURSE_API_V2: process.env.ENABLE_HOME_PAGE_COURSE_API_V2 === 'true',
        ENABLE_CHECKLIST_QUALITY: process.env.ENABLE_CHECKLIST_QUALITY || 'true',
        ENABLE_GRADING_METHOD_IN_PROBLEMS: process.env.ENABLE_GRADING_METHOD_IN_PROBLEMS === 'true',
        LIBRARY_UNSUPPORTED_BLOCKS: (process.env.LIBRARY_UNSUPPORTED_BLOCKS || 'conditional,step-builder,problem-builder').split(','),
      }, 'CourseAuthoringConfig');
    },
  },
  messages,
  requireAuthenticatedUser: true,
});
