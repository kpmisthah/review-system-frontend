import './Skeleton.css';

const Skeleton = ({ type = 'text', width, height, className = '' }) => {
    const style = {
        width,
        height,
    };

    return (
        <div
            className={`skeleton skeleton-${type} ${className}`}
            style={style}
        />
    );
};

export default Skeleton;
