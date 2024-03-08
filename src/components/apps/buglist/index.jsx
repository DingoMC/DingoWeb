import { useState } from 'react';
import { createBugId } from '../../../lib/vcs';
import Fixed from '../../vcs/fixed';
import Bug from '../../vcs/bug';
import styles from './styles.module.css'
import Version from '../../vcs/version';
export default function Buglist (props) {
    const { data } = props;

    const [show, setShow] = useState(false);

    const versionRange = (versionFrom, versionUntil) => {
        if (versionFrom === versionUntil) return (
            <div style={{display: 'inline-flex', flexDirection: 'row', columnGap: '0.2rem'}}>
                <span>{'Version: '}</span>
                <Version version={versionFrom} border={false} background={false} />
            </div>);
        if (!versionUntil) return (
            <div style={{display: 'inline-flex', flexDirection: 'row', columnGap: '0.2rem'}}>
                <span>{'Versions: '}</span>
                <Version version={versionFrom} border={false} background={false} />
                <span>{'+'}</span>
            </div>);
        return (
            <div style={{display: 'inline-flex', flexDirection: 'row', columnGap: '0.2rem'}}>
                <span>{'Versions: '}</span>
                <Version version={versionFrom} border={false} background={false} />
                <span>{' - '}</span>
                <Version version={versionUntil} border={false} background={false} />
            </div>);
    }

    return (
        <>
            <div className={styles.top}>
                <div className={styles.description}>Buglist:</div>
                { show ?
                    <div onClick={() => setShow(false)} className={styles.hide}>{"[Hide]"}</div> :
                    <div onClick={() => setShow(true)} className={styles.show}>{"[Show]"}</div>
                }
            </div>
            {show &&
                <div className={styles.list}>
                    {data.buglist &&
                        data.buglist.map((b) => {
                            return (
                                <div key={b.id} id={createBugId(b.id)} className={styles.top}>
                                    <Bug bugId={createBugId(b.id)} />
                                    {b.fixed === true && <Fixed /> }
                                    <span className={styles.description}>{b.description}</span>
                                    <span className={styles.description}>{versionRange(b.versionFrom, b.versionUntil)}</span>
                                </div>
                            );
                        }).reverse()
                    }
                </div>
            }
        </>
    )
}