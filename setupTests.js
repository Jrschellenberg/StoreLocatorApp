import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import './polyfills/firenet.entry.polyfills';

configure({ adapter: new Adapter() });
