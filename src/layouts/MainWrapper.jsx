import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { setUser } from '../utils/auth';
import Loading from '../views/UI/Loading';

const MainWrapper = ({ children }) => {
    // Initialize the 'loading' state variable and set its initial value to 'true'
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    // Define a useEffect hook to handle side effects after component mounting and on route changes
    useEffect(() => {
        // Define an asynchronous function 'handler'
        const handler = async () => {
            // Set the 'loading' state to 'true' to indicate the component is loading
            setLoading(true);

            // Record the start time
            const startTime = Date.now();

            // Perform an asynchronous user authentication action
            await setUser();

            // Calculate elapsed time
            const elapsed = Date.now() - startTime;

            // Minimum loading duration in ms
            const minLoadingTime = 500;

            // If elapsed time is less than minimum, wait the remaining time
            if (elapsed < minLoadingTime) {
                await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsed));
            }

            // Set the 'loading' state to 'false' to indicate the loading process has completed
            setLoading(false);
        };

        // Call the 'handler' function immediately after the component is mounted or route changes
        handler();
    }, [location]);

    // Render content conditionally based on the 'loading' state
    return <>{loading ? (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 120px)"
        }}>
            <Loading />
        </div>
    ) : children}</>;
};

export default MainWrapper;
