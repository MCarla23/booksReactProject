import './Container.css'

export default function Container({classNames = "", children}){
    return (
        <div className={"container "+classNames}>
            {children}
        </div>
    )
}