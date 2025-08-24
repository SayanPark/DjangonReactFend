import moment from "moment-jalaali";

moment.loadPersian({ dialect: "persian-modern" });

function Moment(date) {
    return moment(date).format("jDD / jMM / jYYYY");
}
export default Moment;
