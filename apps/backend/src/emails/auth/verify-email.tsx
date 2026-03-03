import { toTitleCase } from "@filmato/utils";
import { Body, Container, Heading, Img, Preview, Section, Text } from "@react-email/components";
import FilmatoButton from "../components/button.js";
import BaseLayout from "../layouts/base-layout.js";

type Props = {
    username: string;
    verificationUrl: string;
}

function VerifyEmail({ verificationUrl, username }: Props) {
    const name = toTitleCase(username);
    return (
        <BaseLayout>
            <Body>
                <Preview>Verify your email for Filmato</Preview>
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
                            {`Hey ${name}, Verify your email address`}
                        </Heading>
                        <Section className="py-7 mx-auto max-w-full w-fit">
                            <Img
                                height={120}
                                className="object-cover"
                                src="https://cdn.filmato.satyambhosale.com/logos/verify-email.png"
                            />
                        </Section>
                        <Text className="text-sm font-medium">
                            Thanks for signing up! To complete your registration and start using Filmato, please verify your email address by clicking the button below.
                        </Text>
                    </Section>
                    <Section className="pt-5 pb-10">
                        <FilmatoButton href={verificationUrl}>
                            Verify Email
                        </FilmatoButton>
                    </Section>
                </Container>
            </Body>
        </BaseLayout>
    )
}

export default VerifyEmail;