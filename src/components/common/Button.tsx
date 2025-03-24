import * as React from 'react';
import css from './Button.module.css';

type Props = {
    label?: string;
    small?: boolean;
    className?: string;
    disabled?: boolean;
    onClick: () => void;
}

export const Button: React.FC<Props> = ({ label = '', className = '', disabled = false, small = false, onClick }) => (
    <div className={`${css.button} ${small && css.smallButton} ${disabled && css.disabled} ${className}`.trimEnd()} onClick={() => {
        if (!disabled) onClick();
    }}>
        {label}
    </div>
);