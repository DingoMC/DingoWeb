import { useState } from 'react';
import styles from './styles.module.css'
import Version from '../../vcs/version';
import { getBugFromChangelog } from '../../../lib/vcs';
import Bug from '../../vcs/bug';

export default function Changelog (props) {
    const { data } = props;

    const [show, setShow] = useState(false);

    const generateChangelogLine = (line) => {
        let bugId = getBugFromChangelog(line);
        if (bugId === null) return (<span>{line}</span>);
        let elems = [];
        let words = line.split(' ');
        for (let i = 0; i < words.length; i++) {
            if (words[i].startsWith('#')) elems.push(<Bug bugId={bugId} border={false} background={false} />)
            else elems.push(<span>{words[i]}</span>)
        }
        return elems;
    }

    return (
        <>
            <div className={styles.top}>
                <div className={styles.description}>Changelog:</div>
                { show ?
                    <div onClick={() => setShow(false)} className={styles.hide}>{"[Hide]"}</div> :
                    <div onClick={() => setShow(true)} className={styles.show}>{"[Show]"}</div>
                }
            </div>
            {show &&
                <div className={styles.list}>
                    {data.changelog &&
                        data.changelog.map((c) => {
                            return (
                                <ul className={styles.list}>
                                    <Version version={c.version} />
                                    {c.features && c.features.map((f) => {
                                        return <li className={styles.description}>{generateChangelogLine(f)}</li>
                                    })}
                                </ul>
                            );
                        })
                    }
                </div>
            }
        </>
    ); 
}