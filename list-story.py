import json
import boto3

def lambda_handler(event, context):
    s3 = boto3.client('s3')
    bucket_name = 'capstone-story-project'
    
    try:
        response = s3.list_objects_v2(Bucket=bucket_name)
        
        stories = []
        if 'Contents' in response:
            for obj in response['Contents']:
                if obj['Key'].endswith('.txt'):
                    stories.append({
                        'filename': obj['Key'],
                        'lastModified': obj['LastModified'].isoformat(),
                        'size': obj['Size']
                    })
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'stories': stories})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
