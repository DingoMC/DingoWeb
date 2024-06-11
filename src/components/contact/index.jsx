import { Link } from 'react-router-dom'
import styles from './styles.module.css'
import MainLayout from '../../layouts/main'
import Email from './email'
import Instagram from './instagram'
import Discord from './discord'
import Soundcloud from './soundcloud'
import ScheduleCard from './schedule'

const Contact = () => {
    return (
        <MainLayout current="contact">
            <div className={styles.grid}>
                <ScheduleCard title={'Available Hours'} name={'DingoMC\'s Schedule'} link={'/schedule'} />
                <Email title={'Contact via Gmail'} email={'trianglecomtriangle@gmail.com'} />
                <Instagram title={'DingoMC\'s Instagram'} name={'martin.dingomc'} instalink={'https://www.instagram.com/martin.dingomc/'} />
                <Discord title={'DingoMC\'s Discord'} name={'dingomc (DingoMC#2776)'} />
                <Soundcloud title={'DingoMC Music'} name={'dingomc'} link={'https://soundcloud.com/dingomc'} />
            </div>
        </MainLayout>
    )
}

export default Contact