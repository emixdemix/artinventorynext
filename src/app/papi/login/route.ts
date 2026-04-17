import { NextRequest, NextResponse } from "next/server";
import { getUser, saveLoginInfo } from "@/server/db/database";
import { set } from "@/server/db/session";
import { verifyRecaptcha } from "@/server/recaptcha";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise";

async function createAssessment(body: Record<string, any>) {
  // Create the reCAPTCHA client & set the project path. There are multiple
  // ways to authenticate your client. For more information see:
  // https://cloud.google.com/docs/authentication
  // TODO: To avoid memory issues, move this client generation outside
  // of this example, and cache it (recommended) or call client.close()
  // before exiting this method.
  const client = new RecaptchaEnterpriseServiceClient();
  const projectPath = client.projectPath(body.projectID);

  // Build the assessment request.
  const request = {
    assessment: {
      event: {
        token: body.token,
        siteKey: body.recaptchaKey,
      },
    },
    parent: projectPath,
  };
  // client.createAssessment() can return a Promise or take a Callback
  const [response] = await client.createAssessment(request);

  // Check if the token is valid.
  if (!response.tokenProperties?.valid) {
    console.log(
      "The CreateAssessment call failed because the token was: " +
        response.tokenProperties?.invalidReason,
    );

    return null;
  }

  // Check if the expected action was executed.
  // The `action` property is set by user client in the
  // grecaptcha.enterprise.execute() method.
  if (response.tokenProperties.action === body.recaptchaAction) {
    // Get the risk score and the reason(s).
    // For more information on interpreting the assessment,
    // see: https://cloud.google.com/recaptcha/docs/interpret-assessment
    console.log("The reCAPTCHA score is: " + response.riskAnalysis?.score);

    response.riskAnalysis?.reasons?.forEach((reason) => {
      console.log(reason);
    });
    return response.riskAnalysis?.score;
  } else {
    console.log(
      "The action attribute in your reCAPTCHA tag " +
        "does not match the action you are expecting to score",
    );
    return null;
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password } = body;

  const recaptchaToken = body.recaptchaToken || body["g-recaptcha-response"];

  // const score = await createAssessment({
  //   projectID: "artinventory-15400",
  //   recaptchaKey: process.env.NEXT_PUBLIC_RC_SITE_KEY,
  //   token: recaptchaToken,
  //   recaptchaAction: "submit",
  // });

  // if (!score) {
  //   return NextResponse.json({}, { status: 417 });
  // }

  const res = verifyRecaptcha(recaptchaToken);

  if (!res) {
    return NextResponse.json({}, { status: 403 });
  }

  if (!username || !password) {
    return NextResponse.json({}, { status: 403 });
  }

  const response = await getUser({ email: username });
  if (!response) {
    return NextResponse.json({}, { status: 404 });
  }

  if (await bcrypt.compare(password, response.password)) {
    await saveLoginInfo(response);
    const session = uuidv4();
    await set({ key: session, data: response, timetolive: 3600 * 24 * 1000 });
    return NextResponse.json(
      { session, profile: response.profile },
      { status: 200 },
    );
  } else {
    return NextResponse.json({}, { status: 404 });
  }
}
