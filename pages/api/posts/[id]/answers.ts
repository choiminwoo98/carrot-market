import { withIronSessionApiRoute } from "iron-session/next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
    body: { answer },
  } = req;

  const post = await client.post.findUnique({
    where: {
      id: +id!.toString(),
    },
    select: {
      id: true,
    },
  });
  const newAnswer = await client.answer.create({
    data: {
      user: {
        connect: {
          id: user?.id,
        },
      },
      post: {
        connect: {
          id: +id!.toString(),
        },
      },
      answer,
    },
  });
  console.log(newAnswer);
  //   if(!post){}
  res.json({
    ok: true,
    answer: newAnswer,
  });
}
export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
