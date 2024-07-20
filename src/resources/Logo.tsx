import { Image } from 'react-bootstrap';
import Logo from '../resources/LogoBig.png';

const RecipeStoreLogo: React.FC = () => {

    return (
        <Image src={Logo} style={{height: '2.3rem'}}></Image>
    )
}


export default RecipeStoreLogo;