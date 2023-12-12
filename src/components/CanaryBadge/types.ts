export type CanaryConfig = {
    privateBeta: {
        emails: string[]
    }
    publicBeta: {
        emails: string[]
    }
}

export enum CanaryStatus {
    publicBeta = 'publicBeta',
    privateBeta = 'privateBeta',
}