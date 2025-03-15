import { useGlobalActions } from '@/composables/useGlobalActions';

export function info(title, desc, okText) {
  return new Promise((resolve) => {
    useGlobalActions().dialog({
      type: 'info',
      title: title,
      content: desc,
      positiveText: okText || 'OK',
      onPositiveClick: () => {
        resolve();
      },
    });
  });
}

export function infoToast(title, desc) {
  useGlobalActions().message(title + (desc || ''), {
    type: 'info',
    keepAliveOnHover: true,
  });
}

export function success(title, desc, okText) {
  return new Promise((resolve) => {
    useGlobalActions().dialog({
      type: 'success',
      title: title,
      content: desc,
      positiveText: okText || 'OK',
      onPositiveClick: () => {
        resolve();
      },
    });
  });
}

export function successToast(title, desc) {
  useGlobalActions().message(title + (desc || ''), {
    type: 'success',
    keepAliveOnHover: true,
  });
}

export function warning(title, desc, okText) {
  return new Promise((resolve) => {
    useGlobalActions().dialog({
      type: 'warning',
      title: title,
      content: desc,
      positiveText: okText || 'OK',
      onPositiveClick: () => {
        resolve();
      },
    });
  });
}

export function warningToast(title, desc) {
  useGlobalActions().message(title + (desc || ''), {
    type: 'warning',
    keepAliveOnHover: true,
  });
}

export function error(title, desc, okText) {
  return new Promise((resolve) => {
    useGlobalActions().dialog({
      type: 'error',
      title: title,
      content: desc,
      positiveText: okText || 'OK',
      onPositiveClick: () => {
        resolve();
      },
    });
  });
}

export function errorToast(title, desc) {
  useGlobalActions().message(title + (desc || ''), {
    type: 'error',
    keepAliveOnHover: true,
  });
}

export function confirm(title, desc, okText, cancelText) {

}

export function confirmDanger(title, desc, okText, cancelText) {

}

export function prompt(title, desc, options) {
  /* const params = {
    text: text || '---',
    label: options.label,
    isInteger: options.isInteger,
    maxValue: options.maxValue,
    minValue: options.minValue,
    maxLength: options.maxLength,
    minLength: options.minLength,
    defaultValue: options.defaultValue,
    rules: options.rules,
    description: options.description,
    isNewItem: options.isNewItem,
    isOldABContent: options.isOldABContent,
  }; */

}
