import json
import boto3
import base64
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    s3 = boto3.client('s3')
    bucket_name = 'capstone-story-project'
    
    try:
        if 'body' in event and event['body']:
            body = json.loads(event['body'])
            filename = body.get('filename')
        else:
            filename = event.get('filename')
        
        if not filename:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'filename required'})
            }
        
        try:
            response = s3.get_object(Bucket=bucket_name, Key=filename)
            image_data = response['Body'].read()
            
            image_base64 = base64.b64encode(image_data).decode('utf-8')
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'imageData': image_base64})
            }
            
        except ClientError as e:
            if e.response['Error']['Code'] == 'NoSuchKey':
                return {
                    'statusCode': 404,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Canvas not found'})
                }
            else:
                raise e
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }