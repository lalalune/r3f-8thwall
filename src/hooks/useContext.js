import { useContext as useReactContext } from 'react';
import { Context } from '../components/ContextProvider';

export default function useContext() {
    const context = useReactContext(Context);

    if (!context) {
        throw new Error('No proper appStateContext provided');
    }
    
    return context;
}
