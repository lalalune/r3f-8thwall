import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Render all children components in another element in the DOM
 */
class PortalModal extends React.Component {
    constructor(props) {
        super(props);
        const { rootElementType } = props;
        this.el = document.createElement(rootElementType);
    }

    componentDidMount() {
        const { rootElement } = this.props;
        rootElement.append(this.el);
    }

    componentWillUnmount() {
        const { rootElement } = this.props;
        rootElement.removeChild(this.el);
    }

    render() {
        const { children } = this.props;
        return ReactDOM.createPortal(
            children,
            this.el,
        );
    }
}

export default PortalModal;
