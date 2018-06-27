import geonset from './geonsets/geonset_001';
import etchset from './etchsets/etchset_000';
import sylmap from './sylmaps/sylmap_000.json';
import { pour, multiPour } from './core/pour';

let patPToSvgJson = (patp) => {
  const seals = multiPour([patp], geonset, etchset, sylmap);
  return seals ? seals[0] : null;
};

export default patPToSvgJson;
