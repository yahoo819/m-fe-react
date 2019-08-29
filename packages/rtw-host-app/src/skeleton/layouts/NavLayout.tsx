/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps
} from '@ant-design/pro-layout';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { formatMessage } from '@/i18n';

import * as styles from './index.less';
import AuthorizedWrapper from '../auth/AuthorizedWrapper';
import { RightContent } from '../components/GlobalHeader/RightContent';

import logo from '../../assets/logo.svg';
import { menu } from '../menu';
import { Icon } from 'antd';

export interface NavLayoutProps extends ProLayoutProps {
  matchedPath?: string;
}

/**
 * use AuthorizedWrapper check all menu item
 */
const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map(item => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return AuthorizedWrapper.check(item.authority, localItem, null) as MenuDataItem;
  });

const defaultRenderCollapsedButton = (collapsed?: boolean) => (
  <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
);

const footerRender: NavLayoutProps['footerRender'] = () => {
  return (
    <div
      style={{
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <h3 style={{ marginRight: 16 }}>王下邀月熊，项目地址：</h3>
      <a href="https://github.com/wx-chevalier/m-fe-rtw">m-fe-rtw</a>
    </div>
  );
};

export const NavLayout: React.FC<NavLayoutProps> = props => {
  const { children, matchedPath } = props;

  const [collapse, toggleCollapse] = React.useState(true);

  /**
   * init variables
   */

  const handleMenuCollapse = (payload: boolean): void => {
    toggleCollapse(payload);
  };

  return (
    <section>
      <ProLayout
        {...props}
        collapsed={collapse}
        logo={logo}
        route={menu}
        siderWidth={240}
        navTheme={'light'}
        menuDataRender={menuDataRender}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl) {
            return defaultDom;
          }

          // 判断是否选中
          if ((matchedPath || '').startsWith(menuItemProps.path)) {
            return <div className={styles.selectedMenu}>{defaultDom}</div>;
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        collapsedButtonRender={_collapsed => {
          return (
            <span>
              <span>{defaultRenderCollapsedButton(_collapsed)}</span>
              <span style={{ marginLeft: 8 }}>Custom App Breadcrumb Nav</span>
            </span>
          );
        }}
        breadcrumbRender={(routers = []) => {
          return [
            {
              path: '/',
              breadcrumbName: formatMessage({
                id: 'menu.home',
                defaultMessage: 'Home'
              })
            },
            ...routers
          ];
        }}
        itemRender={(route, params, routes, paths) => {
          console.log('A');
          const first = routes.indexOf(route) === 0;

          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        footerRender={footerRender}
        formatMessage={formatMessage}
        rightContentRender={rightProps => <RightContent {...rightProps} />}
        onCollapse={handleMenuCollapse}
      >
        {children}
      </ProLayout>
    </section>
  );
};
