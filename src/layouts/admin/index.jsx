import PropTypes from 'prop-types'
import styles from './styles.module.css'
import { particleOptionsAdmin, particleOptionsAdminMobile } from '../../lib/paritcleSetup';
import { useEffect, useMemo, useState } from 'react';
import { loadFull } from 'tsparticles';
import Particles, { initParticlesEngine } from "@tsparticles/react"
import Footer from '../../components/footer';
import NavBarAdmin from '../../components/nav/admin';

export default function AdminLayout (props) {
    const {
        activeTab = '',
        setActiveTab = () => {},
        children,
    } = props;

    const [init, setInit] = useState(false)
    useEffect(() => {
        initParticlesEngine(async (engine) => {
        await loadFull(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);
    const options = useMemo(
        () => (window.innerWidth >= 720 ? particleOptionsAdmin : particleOptionsAdminMobile), [],
    );

    return (
        <>
            <div className={styles.main}>
                <NavBarAdmin activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className={styles.container}>
                    {children}
                </div>
                <Particles id="tsparticles" options={options} />
                <Footer />
            </div>
        </>
    )
}

AdminLayout.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.element),
        PropTypes.element.isRequired,
    ]),
    current: PropTypes.string.isRequired,
}