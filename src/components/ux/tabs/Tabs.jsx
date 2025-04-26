import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Controlled/Uncontrolled Tabs component.
 * If `activeKey` and `onSelect` are provided, Tabs become controlled.
 */
const Tabs = ({
  children,
  isTabsVisible,
  wrapperRef,
  activeKey,
  onSelect,
}) => {
  // Determine if we're in controlled mode
  const isControlled = activeKey !== undefined && onSelect;

  // Fallback to internal state when uncontrolled
  const [internalKey, setInternalKey] = useState(
    React.Children.toArray(children)[0].props.eventKey
  );
  const currentKey = isControlled ? activeKey : internalKey;

  const handleTabClick = (key) => {
    if (isControlled) {
      onSelect(key);
    } else {
      setInternalKey(key);
    }
  };

  return (
    <div className="flex mt-4 items-start relative">
      <div
        className={`bg-white transition-[max-width] absolute left-4 top-0 shadow-lg md:shadow-sm overflow-hidden md:overflow-visible md:h-auto md:static ${
          isTabsVisible ? 'max-w-[220px]' : 'max-w-0 md:max-w-[220px]'
        }`}
      >
        <div ref={wrapperRef}>
          <ul className="flex flex-col border w-[220px]">
            {React.Children.map(children, (child) => {
              const { label, icon, eventKey } = child.props;
              const isActive = currentKey === eventKey;
              return (
                <li
                  key={eventKey}
                  className={`flex items-center px-2 border-b ${
                    isActive ? 'border-blue-500' : ''
                  }`}
                >
                  <FontAwesomeIcon
                    icon={icon}
                    color={isActive ? '#074498' : '#475569'}
                  />
                  <button
                    onClick={() => handleTabClick(eventKey)}
                    className={`text-left w-full p-4 ${
                      isActive ? 'text-brand' : 'text-slate-600'
                    }`}
                  >
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="px-4 w-full">
        {React.Children.map(children, (child) => {
          return child.props.eventKey === currentKey
            ? child.props.children
            : null;
        })}
      </div>
    </div>
  );
};

export default Tabs;
