export function Die({value, isHeld, className, handleClick}){
    className=isHeld ? `${'is-held'} cell` : 'cell';

    return (<div className={className} onClick={handleClick}>
    <p>{value}</p>
    </div>)
}