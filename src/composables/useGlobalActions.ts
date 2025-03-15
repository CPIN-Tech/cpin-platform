import { type ExtractPropTypes } from 'vue';
import { type MessageOptions } from 'naive-ui';
import type { MessageApiInjection, MessageReactive } from 'naive-ui/es/message/src/MessageProvider';
import type {
  NotificationApiInjection,
  NotificationReactive,
} from 'naive-ui/es/notification/src/NotificationProvider';
import type { NotificationOptions } from 'naive-ui/es/notification/src/NotificationEnvironment';

import type {
  DialogApiInjection,
  DialogReactive,
} from 'naive-ui/es/dialog/src/DialogProvider';

import type { exposedDialogEnvProps } from 'naive-ui/es/dialog/src/DialogEnvironment';
type DialogOptions = Partial<ExtractPropTypes<typeof exposedDialogEnvProps>>;



export type NotificationObject = NotificationOptions;

interface InitPayload {
  message: MessageApiInjection;
  notification: NotificationApiInjection;
  dialog: DialogApiInjection,
}

let message: MessageApiInjection | null = null;
let notification: NotificationApiInjection | null = null;
let dialog: DialogApiInjection | null = null;

export function useGlobalActions() {
  return {
    init: (payload: InitPayload): void => {
      message = payload.message;
      notification = payload.notification;
      dialog = payload.dialog;
    },
    message: (content: string, options?: MessageOptions): MessageReactive | undefined => {
      return message?.create(content, options || { type: 'info' });
    },
    notification: (options: NotificationOptions): NotificationReactive | undefined => {
      return notification?.create(options);
    },
    dialog: (options: DialogOptions): DialogReactive | undefined => {
      return dialog?.create(options);
    },
  };
}
