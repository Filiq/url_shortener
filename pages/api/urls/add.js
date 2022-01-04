import dbConnect from "../../../utils/dbConnect";
import Url from "../../../models/Url";
import makeId from "../../../utils/makeId";
import isValidUrl from "../../../utils/isValidUrl";

export default async function add(req, res) {
  let url = req.body.url;

  if (!isValidUrl(url)) {
    return res.status(403).json({ error: true, msg: "URL is not valid", url });
  }

  url = url[url.length - 1] === "/" ? url.substr(0, url.length - 1) : url;

  //check if url is not already shortened

  const url_exists = await Url.findOne({ url }).exec();

  if (url_exists) {
    return res.status(200).json({ short_url: url_exists.short_url });
  }

  let id = makeId(5);

  //check if id is not already used

  let unique = false;

  while (!unique) {
    const exists = await Url.findOne({ short_url: id });
    if (!exists) {
      unique = true;
    } else {
      id = makeId(5);
    }
  }

  await dbConnect();

  try {
    Url.create({ url, short_url: id, date: Date.now() });

    res.status(200).json({ short_url: id });
  } catch (err) {
    console.log(err);
  }
}
