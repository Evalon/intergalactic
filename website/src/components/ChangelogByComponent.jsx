import React from 'react';
import styles from './ChangelogByComponent.module.css';
import Tag from '@semcore/tag';
import { Link } from 'react-router-dom';
import { Text } from '@semcore/typography';
import { getLabel } from './Changelog';
import formatTextStyles from './FormatText.module.css';
import HeadingLink from './HeadingLink.jsx';

const ChangelogByComponent = ({ blocks }) => {
  return blocks.map(({ title, version, components }) => (
    <span key={title} className={formatTextStyles.formatText}>
      <HeadingLink
        level={2}
        id={version}
        style={{
          fontSize: '18px',
          lineHeight: '110%',
          margin: '32px 0 16px 0',
        }}
      >
        <Text bold>{title}</Text>
      </HeadingLink>
      {components.map(({ title, component, changes }) => (
        <div key={component}>
          <Text
            tag="h3"
            style={{
              fontSize: '16px',
              lineHeight: '150%',
              margin: '16px 0',
              fontWeight: 700,
            }}
          >
            <span className={styles.componentTitle}>{title}</span>
            <small>({component})</small>
          </Text>
          <ul className={styles.list}>
            {changes.map(({ type, text }) => (
              <li className={styles.listItem} key={`${type}-${text}`}>
                {getLabel(type)} <Text dangerouslySetInnerHTML={{ __html: text }} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </span>
  ));
  let section;
  return {
    list: (props) => <ul className={styles.list} {...props} />,
    listItem: function ({ children }) {
      let label = null;
      if (!section) return null;
      switch (section.props.children) {
        case 'Added':
          label = (
            <Tag className={styles.tagStyled} size="l" color="green-500">
              {section}
            </Tag>
          );
          break;
        case 'Fixed':
          label = (
            <Tag className={styles.tagStyled} size="l" color="blue-500">
              {section}
            </Tag>
          );
          break;
        case 'Changed':
        case 'Removed':
        case 'Deprecated':
          label = (
            <Tag className={styles.tagStyled} size="l" color="orange-500">
              {section}
            </Tag>
          );
          break;
        case 'BREAK':
        case 'Security':
          label = (
            <Tag className={styles.tagStyled} size="l" color="red-500">
              {section}
            </Tag>
          );
      }
      return (
        <li className={styles.listItem}>
          {label}
          <div>{children}</div>
        </li>
      );
    },
    heading: function ({ level, children }) {
      if (level === 2) {
        const version = children[0]?.props?.children;
        return (
          <Text tag="h3">
            <Text>{version}</Text>
            <small>{children[1]}</small>
          </Text>
        );
      }
      if (level === 3) {
        section = children[0];
      }
      return null;
    },
    link: ({ href, ...props }) => {
      if (href.startsWith('/')) {
        return <Link to={href} {...props} />;
      } else {
        return <a href={href} {...props} />;
      }
    },
    paragraph: () => null,
  };
};

export default ChangelogByComponent;
