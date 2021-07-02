import React from 'react';
import BaseLayout from './BaseLayout';
import {BaseStyles} from "@primer/components";

type Props = any;

function LayoutComponent(props: Props) {
    return (
        <BaseStyles>
            <BaseLayout {...props} />
        </BaseStyles>
    )
}

export type LayoutProps = Props;
export const Layout = LayoutComponent;

export { default as BaseLayout } from "./BaseLayout";
export type { BaseLayoutProps } from './BaseLayout';