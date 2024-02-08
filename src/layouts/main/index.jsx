import PropTypes from 'prop-types'
import styles from './styles.module.css'
import NavBar from '../../components/nav';
import particleOptions, { particleOptionsMobile } from '../../lib/paritcleSetup';
import { useEffect, useMemo, useState } from 'react';
import { loadFull } from 'tsparticles';
import Particles, { initParticlesEngine } from "@tsparticles/react"
import Footer from '../../components/footer';

export default function MainLayout (props) {
    const {
        children,
        current,
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
        () => (window.innerWidth >= 720 ? particleOptions : particleOptionsMobile), [],
    );

    return (
        <>
            <div className={styles.main}>
                <NavBar current={current} />
                <div className={styles.container}>
                    {children}
                </div>
                <Particles id="tsparticles" options={options} />
                <Footer />
            </div>
        </>
    )
}

MainLayout.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.element),
        PropTypes.element.isRequired,
    ]),
    current: PropTypes.string.isRequired,
}