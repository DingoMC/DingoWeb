import { Link } from 'react-router-dom'
import styles from './styles.module.css'
import MainLayout from '../../layouts/main'
import Email from './email'
import Instagram from './instagram'
import Discord from './discord'
import Soundcloud from './soundcloud'

const Contact = () => {
    return (
        <MainLayout current="contact">
            <div className={styles.grid}>
                <Email title={'Contact via Gmail'} email={'trianglecomtriangle@gmail.com'} />
                <Email title={'Contact via Email (PL)'} email={'martin701-2001@wp.pl'} />
                <Instagram title={'DingoMC\'s Instagram'} name={'martin.dingomc'} instalink={'https://www.instagram.com/martin.dingomc/'} />
                <Discord title={'DingoMC\'s Discord'} name={'dingomc (DingoMC#2776)'} />
                <Soundcloud title={'DingoMC Music'} name={'dingomc'} link={'https://soundcloud.com/dingomc'} />
                <Link className={styles.link} to='/schedule'>DingoMC's schedule</Link>
            </div>
        </MainLayout>
    )
}

export default Contact