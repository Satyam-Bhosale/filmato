import { toTitleCase } from "@filmato/utils";
import { Body, Column, Container, Heading, Img, Preview, Row, Section, Text } from "@react-email/components";
import FilmatoButton from "../components/button.js";
import BaseLayout from "../layouts/base-layout.js";

type Props = {
    username: string;
    email: string;
    resetUrl: string;
    ip: string | null | undefined;
    userAgent: string | null | undefined;
    time: string;
}


function SignInAlert({ username, email, ip, userAgent, time, resetUrl }: Props) {
    const name = toTitleCase(username);
    return (
        <BaseLayout>
            <Body>
                <Preview>New login detected on your Filmato account</Preview>
                <Container className="mx-auto my-12.5 max-w-116.25 px-7 border border-solid border-[#ededed] rounded-xl">
                    <Section className="py-5">
                        <Img
                            height={30}
                            className="object-cover"
                            src="https://cdn.filmato.satyambhosale.com/logos/wordmark.png"
                        />
                    </Section>
                    <Section>
                        <Heading as="h2" className="text-2xl font-bold py-0">
                            New login detected on your Filmato account
                        </Heading>
                        <Section className="py-7 mx-auto max-w-full w-fit">
                            <Img
                                height={200}
                                className="object-cover"
                                src="https://cdn.filmato.satyambhosale.com/illustrations/login-alert.png"
                            />
                        </Section>
                        <Text className="text-sm font-medium">
                            Hi {name || "there"},
                        </Text>
                        <Text className="text-sm font-medium">
                            We detected a new login to your Filmato account associated with <strong>{email}</strong>.
                        </Text>
                    </Section>
                    <Section className="bg-[#f6f6f6] rounded-lg px-4 py-3">
                        <Row>
                            <Column>
                                <Text className="text-xs m-1">
                                    Time: <strong>{time || '-'}</strong>
                                </Text>
                                <Text className="text-xs m-1">
                                    Device: <strong>{userAgent || '-'}</strong>
                                </Text>
                                <Text className="text-xs m-1">
                                    IP Address: <strong>{ip || '-'}</strong>
                                </Text>
                            </Column>
                        </Row>
                    </Section>
                    <Text className="text-sm mt-2">
                        If you don’t recognize this activity, we recommend <strong>resetting your password immediately</strong>.
                    </Text>
                    <Section className=" pt-5 pb-10">

                        <FilmatoButton href={resetUrl}>
                            Reset password
                        </FilmatoButton>

                    </Section>
                </Container>
            </Body>
        </BaseLayout>
    )
}

export default SignInAlert;