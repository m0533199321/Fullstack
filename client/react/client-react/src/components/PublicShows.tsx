const PublicShows = ({ showPrivate, showPublic, privateClick, publicClick }: { showPrivate: boolean, showPublic: boolean, privateClick: () => void, publicClick: () => void }) => {
    return (<>
        {showPrivate ? (<>
            <button style={{
                color: 'orange', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold',
                display: 'inlineBlock', paddingBottom: '5px'
            }} onClick={privateClick}>בספר</button>
            <div style={{ borderLeft: '2px solid orange', height: '20px', margin: '0 10px' }}></div>
            <button className={showPublic ? "private-title-with-underline" : ""} style={{
                color: 'white', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold'
            }} onClick={publicClick}>לא בספר</button>
        </>) : (<>
            {showPublic ? (<>
                <button style={{
                    color: 'white', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold',
                }} onClick={privateClick}>בספר</button>
                <div style={{ borderLeft: '2px solid orange', height: '20px', margin: '0 10px' }}></div>
                <button className={showPublic ? "private-title-with-underline" : ""} style={{
                    color: 'orange', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold',
                    display: 'inlineBlock', paddingBottom: '5px'
                }} onClick={publicClick}>לא בספר</button>
            </>) : (<>
                <button style={{
                    color: 'white', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold',
                }} onClick={privateClick}>בספר</button>
                <div style={{ borderLeft: '2px solid orange', height: '20px', margin: '0 10px' }}></div>
                <button className={showPublic ? "private-title-with-underline" : ""} style={{
                    color: 'white', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold'
                }} onClick={publicClick}>לא בספר</button>
            </>)}
        </>)
        }
    </>)
}
export default PublicShows;