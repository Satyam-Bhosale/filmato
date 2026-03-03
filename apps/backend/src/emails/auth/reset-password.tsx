import { toTitleCase } from "@filmato/utils";
import { Body, Container, Heading, Img, Preview, Section, Text } from "@react-email/components";
import FilmatoButton from "../components/button.js";
import BaseLayout from "../layouts/base-layout.js";

type Props = {
    username: string,
    resetUrl: string
}

function ResetPassword({ username, resetUrl }: Props) {
    const name = toTitleCase(username);
    return (
        <BaseLayout>
            <Body className="mx-auto my-auto px-2">
                <Preview>Reset your Filmato password.</Preview>
                <Container className="mx-auto my-12.5 max-w-116.5 px-8 border border-solid border-[#ededed] rounded-xl">
                    <Section className="py-5">
                        <Img
                            height={30}
                            className="object-cover"
                            src="https://cdn.filmato.satyambhosale.com/logos/wordmark.png"
                        />
                    </Section>

                    <Section>
                        <Heading as="h2" className="py-0">
                            {
                                `Hey ${name}, looks like you forgot your password!`
                            }
                        </Heading>
                        <Section className="py-0 mx-auto max-w-full w-fit">
                            <Img
                                height={250}
                                className="object-cover"
                                src="https://cdn.filmato.satyambhosale.com/illustrations/forgot-password.png"
                            />
                        </Section>
                        <Text>
                            To reset your password, click the button below. The link will self-destruct after 10 minutes.
                        </Text>
                    </Section>
                    <Section className="pt-5 pb-10">
                        <FilmatoButton href={resetUrl}>
                            Reset Password
                        </FilmatoButton>
                    </Section>
                </Container>
            </Body>
        </BaseLayout>
    )
}

export default ResetPassword;