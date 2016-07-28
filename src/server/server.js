import "source-map-support/register";
import {test} from "shared/test";
import _ from "lodash";

_.forEach([1,2,3,4], val =>{
  console.log(val);
});
test();