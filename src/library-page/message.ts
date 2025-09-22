import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  headingTitle: {
    id: 'course-authoring.library-page.heading.title',
    defaultMessage: 'My Library',
  },
  addNewMaterialBtnText: {
    id: 'course-authoring.library-page.add-new-material.btn.text',
    defaultMessage: 'New material',
  },
  librariesTabErrorMessage: {
    id: 'course-authoring.library-page.libraries.tab.error.message',
    defaultMessage: 'Failed to fetch libraries. Please try again later.',
  },
  librariesTabLibraryNotFoundAlertTitle: {
    id: 'course-authoring.library-page.libraries.tab.library.not.found.alert.title',
    defaultMessage: 'We could not find any result',
  },
});

export default messages;
