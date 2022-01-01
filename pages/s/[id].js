import Url from "../../models/Url";
import dbConnect from "../../utils/dbConnect";

export default function shortRedirect() {
  return <div></div>;
}

export async function getServerSideProps(ctx) {
  const id = ctx.params.id;

  await dbConnect();

  const url = await Url.findOne({ short_url: id }).exec();

  if (!url) {
    return {
      redirect: {
        destination: "/404",
        permanent: true,
      },
    };
  }

  return {
    redirect: {
      destination: url.url,
      permanent: true,
    },
  };
}
