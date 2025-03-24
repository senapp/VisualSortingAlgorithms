import * as React from 'react';
import { RenderView } from './components/RenderView';
import css from './App.module.css';

export const App: React.FC = () => {
    return (
        <div className={css.container}>
            <RenderView />
        </div>
    );
};