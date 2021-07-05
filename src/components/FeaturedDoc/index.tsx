import React, {useState} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {BorderBox, BorderBoxProps, Button, Heading, Link, StyledOcticon, Text, themeGet} from "@primer/components";
import styled from "styled-components";
import {StarFillIcon, StarIcon} from "@primer/octicons-react";

type Props = BorderBoxProps & {
    title: string;
    modifiedAt?: number;
};

const Container = styled.div`
    &:hover {
        border-color: ${themeGet('colors.border.info')};
    }
`;

const ContainerLink = styled.a`
    position: relative;
    display: flex;
    flex-direction: column;
    padding: ${themeGet('space.2')};
    text-decoration: none;
    color: ${themeGet('colors.text.secondary')};
    &:hover, &:focus {
        color: ${themeGet('colors.text.link')};
    }
`;

const FavoriteIcon = styled.svg`
    color: ${themeGet('colors.icon.secondary')};
    &.favorite {
        color: ${themeGet('colors.icon.info')};
    }
    &:hover, &:focus {
        color: ${themeGet('colors.icon.info')};
    }
`;

const FavoriteContainer = styled.div`
    position: absolute;
    top: ${themeGet('space.2')};
    right: ${themeGet('space.2')};
    // padding: ${themeGet('space.1')} ${themeGet('space.3')};
`;

function FeaturedDoc(props: Props) {
    const { title, modifiedAt, ...boxProps } = props;
    const [favorited, setFavorited] = useState(false);

    const favoriteIcon = favorited ? StarFillIcon : StarIcon;
    const favoriteTitle = favorited ? 'Unmark this document as a favorite' : 'Mark this document as a favorite';
    const onToggleFavorite = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setFavorited(!favorited);
    }

    const modifiedAtDate = modifiedAt ? new Date(modifiedAt) : null;

    return (
        <Container as={BorderBox} {...boxProps}>
            <ContainerLink as={RouterLink} to={'/write'}>
                <FavoriteContainer title={favoriteTitle} onClick={onToggleFavorite}>
                    <FavoriteIcon as={StyledOcticon} icon={favoriteIcon} className={favorited ? 'favorite' : undefined} />
                </FavoriteContainer>
                <Heading fontSize={20} as={'h6'} mb={2}>{title}</Heading>
                <Text as={'small'} color={'text.tertiary'} ml={'auto'}>Last Modified: {modifiedAtDate?.toLocaleString() || 'N/A'}</Text>
            </ContainerLink>
        </Container>
    );
}

export type FeaturedDocProps = Props;
export default FeaturedDoc;
