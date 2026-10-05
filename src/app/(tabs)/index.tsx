import { Redirect } from 'expo-router';
import { ROUTES } from '../../actions/constants';
export default function Index() {
  return <Redirect href={ROUTES.home} />;
}
