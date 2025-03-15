import { renderIcon } from '@/utils';
import { h } from 'vue';
import { RouterLink } from 'vue-router';
import { type MenuMixedOption } from 'naive-ui/es/menu/src/interface';

/* eslint-disable @typescript-eslint/no-unused-vars */
export default function getItems(
  mode: 'vertical' | 'horizontal',
  collapsed: boolean,
): MenuMixedOption[] {
  return [
    {
      key: 'BlankPage',
      icon: renderIcon('carbon:dashboard'),
      label: () =>
        h(
          RouterLink,
          {
            to: {
              name: 'BlankPage',
            },
          },
          { default: () => 'Home' },
        ),
    },
    {
      key: 'Solar-Panels',
      icon: renderIcon('carbon:solar-panel'),
      label: () =>
        h(
          RouterLink,
          {
            to: {
              name: 'SolarPanels',
            },
          },
          { default: () => 'Solar Panels' },
        ),
    },
    {
      key: 'Energy-Production',
      icon: renderIcon('carbon:energy-renewable'),
      label: () =>
        h(
          RouterLink,
          {
            to: {
              name: 'Profile',
            },
          },
          { default: () => 'Profile' },
        ),
    },
    {
      key: 'Transactions',
      icon: renderIcon('bitcoin-icons:transactions-filled'),
      label: () =>
        h(
          RouterLink,
          {
            to: {
              name: 'Transactions',
            },
          },
          { default: () => 'Transactions' },
        ),
    },

    // {
    //   key: 'Settings',
    //   icon: renderIcon('carbon:settings'),
    //   label: () =>
    //     h(
    //       RouterLink,
    //       {
    //         to: {
    //           name: 'Settings',
    //         },
    //       },
    //       { default: () => 'Settings' },
    //     ),
    // },
  ];
}
